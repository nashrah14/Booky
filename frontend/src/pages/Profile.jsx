import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Button,
  Input,
  Label,
  Textarea,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
} from "@/components/InlineComponents";
import { BookOpen, Mail, User, Calendar, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
  });

  // Populate edit form once user is available
  useEffect(() => {
    if (user) {
      setEditForm({
        username: user.username || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  // Redirect only AFTER loading finishes
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  const handleSave = async () => {
    try {
      // Update via backend
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("booky_token")}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      toast({
        title: "Profile updated",
        description: "Your profile was updated successfully",
      });

      setEditing(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BookOpen className="h-12 w-12 text-amber-600 animate-pulse" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your personal details</CardDescription>
                </div>

                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} className="bg-amber-600 hover:bg-amber-700">
                      <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-xl">
                      {user.username?.charAt(0)?.toUpperCase() ||
                        user.email?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="text-lg font-semibold">{user.username}</h3>
                    <p className="text-gray-600 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </p>
                  </div>
                </div>

                {editing ? (
                  <>
                    <div>
                      <Label>Username</Label>
                      <Input
                        value={editForm.username}
                        onChange={(e) =>
                          setEditForm({ ...editForm, username: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Bio</Label>
                      <Textarea
                        rows={4}
                        value={editForm.bio}
                        onChange={(e) =>
                          setEditForm({ ...editForm, bio: e.target.value })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label>Username</Label>
                      <p className="mt-1">{user.username || "—"}</p>
                    </div>

                    <div>
                      <Label>Bio</Label>
                      <p className="mt-1">{user.bio || "No bio added yet"}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Stats</CardTitle>
                <CardDescription>Your journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-600">Member since</p>
                    <p className="font-semibold">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-600">Books read</p>
                    <p className="font-semibold">0</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-600">Reading streak</p>
                    <p className="font-semibold">0 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

"use client";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/user-convex-query";
import { BarLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
const SettingPage = () => {
  const [username, setUsername] = useState("");
  const { data: currentUser, isLoading } = useConvexQuery(
    api.users.getCurrentUser
  );

  const { mutate: updateUsername, isLoading: isSubmitting } = useConvexMutation(
    api.users.updateUsername
  );

  if (isLoading) {
    return <BarLoader color="#d8b4fe" width={"95%"} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    await updateUsername({ username: username.trim() });
    toast.success("Username updated successfully");
    setUsername("");
  };

  return (
    <div className=" space-y-8 p-4 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text-primary">Settings</h1>
        <p className="text-slate-400 mt-2">
          Manage your profile and account preferences
        </p>
      </div>

      <Card className={"card-glass max-w-2xl"}>
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="h-5 w-5 mr-2" />
            Username Settings
          </CardTitle>
          <CardDescription>
            Set your unique username for your public profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="" className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username" className={"text-white"}>
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={"bg-slate-800 border-slate-600 text-white"}
              />

              {currentUser?.username && (
                <div className="text-sm text-slate-400">
                  Current username:
                  <span className="text-white"> @{currentUser.username}</span>
                </div>
              )}

              <div className="text-xs text-slate-500">
                3-20 characters, letters, numbers, underscores, and hyphens only
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant={"primary"}
                className={"w-full sm:w-auto"}
                type={"submit"}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating ...
                  </>
                ) : (
                  "Update Username"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingPage;

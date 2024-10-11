import { getSession } from "@auth0/nextjs-auth0";
import ProfileClient from "./components/user-client";
import ProfileServer from "./components/user-server";
import { redirect } from "next/navigation";

const Profile = async () => {
  const session = await getSession();
  const user = session?.user;

  // 1st way to auth
  if (!user) {
    redirect("/");
  }
  return (
    <div className="flex items-center justify-center w-full mt-10 px-44">
      <div className="flex items-center w-full justify-between">
        <div>
          <h1 className="text-2xl mb-4">Client Component</h1>
          <ProfileClient />
        </div>
        <div>
          <h1 className="text-2xl mb-4">Server Component</h1>
          <ProfileServer />
        </div>
      </div>
    </div>
  );
};

export default Profile;
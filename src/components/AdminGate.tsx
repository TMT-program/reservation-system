import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";

type AdminGateProps = {
  children: JSX.Element;
};

export const AdminGate = ({ children }: AdminGateProps) => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const snapshot = await getDoc(doc(db, "admins", user.uid));
      setIsAdmin(snapshot.exists());
    };

    if (!loading) {
      checkAdmin();
    }
  }, [loading, user]);

  if (loading || isAdmin === null) {
    return (
      <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
        管理者情報を確認しています…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
        state={{ message: "管理者権限がないためアクセスできません。" }}
      />
    );
  }

  return children;
};

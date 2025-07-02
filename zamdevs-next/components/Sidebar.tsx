import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaHome, FaBook, FaSmile, FaTasks, FaChartBar, FaCog, FaUser, FaSignOutAlt, FaBars, FaGlobe } from "react-icons/fa";
import styles from "../pages/dashboard/Sidebar.module.css";
import { supabase } from "../lib/supabaseClient";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: <FaHome /> },
  { label: "Feed", path: "/feed", icon: <FaGlobe /> },
  { label: "Journal", path: "/dashboard/journal", icon: <FaBook /> },
  { label: "Mood Tracker", path: "/dashboard/mood", icon: <FaSmile /> },
  { label: "Task", path: "/dashboard/tsk", icon: <FaTasks /> },
  { label: "Analytics", path: "/dashboard/analytics", icon: <FaChartBar /> },
  { label: "Account", path: "/dashboard/account", icon: <FaUser /> },
  { label: "Settings", path: "/dashboard/settings", icon: <FaCog /> },
];

export default function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (v: boolean) => void }) {
  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; avatar: string } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();
      setProfile({
        name: profile?.full_name?.split(" ")[0] || "User",
        avatar: profile?.avatar_url || "/default-avatar.png",
      });
    }
    fetchProfile();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <nav
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : styles.expanded}`}
      aria-label="Sidebar Navigation"
      style={{
        background: "linear-gradient(135deg, #A09ABC 0%, #B6A6CA 100%)",
        boxShadow: "4px 0 24px 0 rgba(160, 154, 188, 0.12), 0 2px 8px 0 rgba(212, 190, 190, 0.08)",
        backdropFilter: "blur(18px)",
        borderRight: "2px solid #E1D8E9",
        paddingTop: collapsed ? '1.2rem' : '1.5rem',
        transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1), min-width 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.4s cubic-bezier(0.4,0,0.2,1)',
        width: collapsed ? '64px' : '240px',
        minWidth: collapsed ? '64px' : '240px',
      }}
    >
      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{
          alignSelf: 'flex-end',
          marginBottom: collapsed ? '0.5rem' : '1rem',
          transition: 'margin 0.3s',
        }}
      >
        <FaBars style={{
          fontSize: '1.7rem',
          transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
          transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
        }} />
      </button>
      <div className={styles.logo} style={{ fontSize: collapsed ? "2.2rem" : "2.2rem", justifyContent: "center", marginBottom: collapsed ? '1.2rem' : '2rem', transition: 'margin 0.3s' }}>
        <FaBook style={{ fontSize: "2rem", transition: 'font-size 0.4s' }} />
        {!collapsed && <span style={{ fontWeight: 800, fontSize: '2rem', color: '#fff', letterSpacing: 1, transition: 'opacity 0.3s' }}>Reflectly</span>}
      </div>
      <ul className={styles.menuList}>
        {menuItems.map((item) => (
          <li key={item.label} className={styles.menuItem}>
            <Link href={item.path} legacyBehavior>
              <a
                className={
                  styles.menuLink +
                  (router.pathname === item.path ? ' ' + styles.active : '')
                }
                tabIndex={0}
                title={collapsed ? item.label : undefined}
                style={{
                  position: 'relative',
                  background: router.pathname === item.path ? 'rgba(255,255,255,0.18)' : 'none',
                  boxShadow: router.pathname === item.path ? '0 2px 8px #E1D8E9' : 'none',
                  color: router.pathname === item.path ? '#A09ABC' : '#fff',
                  fontWeight: router.pathname === item.path ? 700 : 500,
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                <span className={styles.iconWrapper} style={{ fontSize: '1.5rem', transition: 'transform 0.2s', transform: router.pathname === item.path ? 'scale(1.15)' : 'scale(1)' }}>{item.icon}</span>
                <span className={styles.menuText} style={{ opacity: collapsed ? 0 : 1, transform: collapsed ? 'translateX(-12px)' : 'translateX(0)', transition: 'opacity 0.3s, transform 0.3s' }}>{!collapsed && item.label}</span>
                {router.pathname === item.path && <span className={styles.activeIndicator} />}
              </a>
            </Link>
          </li>
        ))}
        <li className={styles.menuItem + ' ' + styles.logoutBtn}>
          <button
            onClick={handleLogout}
            className={styles.menuLink}
            tabIndex={0}
            title={collapsed ? "Log out" : undefined}
            style={{ color: '#D4BEBE', fontWeight: 600 }}
          >
            <span className={styles.iconWrapper}><FaSignOutAlt /></span>
            <span className={styles.menuText} style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.3s' }}>{!collapsed && "Log out"}</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
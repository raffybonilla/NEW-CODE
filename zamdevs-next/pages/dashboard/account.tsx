import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { supabase } from "../../lib/supabaseClient";
import Sidebar from "../../components/Sidebar";
import Head from "next/head";
import { TransitionContext } from "../_app";

type JournalEntry = {
id: string;
created_at: string;
title?: string;
content?: string;
// Add other fields as needed from your journal table
[key: string]: unknown;
};

export default function Account() {
const [header, setHeader] = useState("/default-header.jpg");
const [avatar, setAvatar] = useState("/default-avatar.png");
const [name, setName] = useState("Your Name");
const [bio, setBio] = useState("Short bio goes here...");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
const [userId, setUserId] = useState<string | null>(null);
const [collapsed, setCollapsed] = useState(false);
const [showText, setShowText] = useState(false);
const { showContent } = useContext(TransitionContext);
const [profileLoading, setProfileLoading] = useState(false);
const [profileSuccess, setProfileSuccess] = useState(false);

useEffect(() => {
setTimeout(() => setShowText(true), 100);
}, []);

// Fetch user info and profile images
useEffect(() => {
async function fetchProfile() {
const { data: { user } } = await supabase.auth.getUser();
if (user) {
setEmail(user.email || "");
setUserId(user.id);
// Fetch profile from your 'profiles' table
const { data: profile } = await supabase
.from("profiles")
.select("avatar_url, header_url, full_name, bio, phone")
.eq("id", user.id)
.single();
if (profile) {
setAvatar(profile.avatar_url || "/default-avatar.png");
setHeader(profile.header_url || "/default-header.jpg");
setName(profile.full_name || "Your Name");
setBio(profile.bio || "Short bio goes here...");
setPhone(profile.phone || "");
}
// Fetch journal entries
const { data: journals } = await supabase
.from("journal")
.select("*")
.eq("user_id", user.id)
.order("created_at", { ascending: false });
setJournalEntries(journals || []);
}
}
fetchProfile();
}, []);

async function handlePhoneSave() {
if (userId) {
setProfileLoading(true);
await supabase.from("profiles").update({
full_name: name,
bio,
phone,
}).eq("id", userId);
setProfileLoading(false);
setProfileSuccess(true);
setTimeout(() => setProfileSuccess(false), 3000);
}
}

return (
<div className="relative min-h-screen w-full flex animate-gradient-bg overflow-hidden">
<Head>
<title>Account | Reflectly</title>
</Head>
{/* Sidebar */}
<Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
{/* Animated Clouds */}
<div className="absolute left-0 top-24 w-1/2 z-10 animate-cloud-left pointer-events-none">
<svg width="320" height="80" viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="60" cy="60" rx="60" ry="20" fill="#D5CFE1" />
<ellipse cx="140" cy="50" rx="50" ry="18" fill="#E1D8E9" />
<ellipse cx="220" cy="65" rx="70" ry="22" fill="#B6A6CA" />
</svg>
</div>
<div className="absolute right-0 top-40 w-1/3 z-10 animate-cloud-right pointer-events-none">
<svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="50" cy="40" rx="50" ry="15" fill="#E1D8E9" />
<ellipse cx="120" cy="30" rx="40" ry="12" fill="#D5CFE1" />
</svg>
</div>
{/* Twinkling Stars */}
<div className="absolute left-1/3 top-1/4 text-[#fff] text-2xl opacity-80 z-0 animate-twinkle">✦</div>
<div className="absolute right-1/4 bottom-1/3 text-[#fff] text-xl opacity-60 z-0 animate-twinkle">✧</div>
<div className="absolute left-1/4 bottom-1/4 text-[#fff] text-lg opacity-40 z-0 animate-twinkle" style={{ animationDelay: "1s" }}>✦</div>
<div className="absolute left-1/2 top-1/6 text-[#fff] text-lg opacity-60 z-0 animate-twinkle" style={{ animationDelay: "2s" }}>✦</div>
{/* Main Content */}
<main className={`flex-1 ${collapsed ? 'mx-auto' : 'ml-64'} flex items-center justify-center p-6 min-h-screen`}>
<div className={`relative z-20 w-full max-w-2xl mx-auto px-0 py-0 bg-white/10 rounded-3xl shadow-2xl backdrop-blur-md transition-all duration-700 ${showText && showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
{/* Header Banner */}
<div className="relative h-56 w-full bg-gradient-to-r from-[#A09ABC]/40 to-[#B6A6CA]/40 rounded-t-3xl overflow-hidden flex items-center justify-center">
<Image
src={header}
alt="Header"
fill
style={{ objectFit: "cover" }}
className="rounded-t-3xl"
onError={(e) => (e.currentTarget.src = "/default-header.png")}
/>
</div>
{/* Profile Picture and Info Row */}
<div className="relative flex flex-row items-end justify-between px-8 -mt-16">
{/* Avatar */}
<div className="relative border-8 border-white rounded-full w-36 h-36 bg-white shadow flex items-center justify-center overflow-hidden">
<Image
src={avatar}
alt="Avatar"
width={144}
height={144}
style={{ objectFit: "cover" }}
onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
/>
</div>
{/* Save Profile Button (styled like Follow) */}
<div className="mb-8">
{profileSuccess && (
<div className="text-green-600 bg-white/80 border border-green-300 rounded-lg p-2 mb-2 text-center shadow">
Profile updated successfully!
</div>
)}
<button
onClick={handlePhoneSave}
className="px-8 py-3 rounded-full bg-gradient-to-r from-[#A09ABC] to-[#B6A6CA] text-white font-bold text-lg shadow hover:from-[#B6A6CA] hover:to-[#A09ABC] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#A09ABC]/30"
disabled={profileLoading}
style={{ minWidth: 140 }}
>
{profileLoading ? "Saving..." : "Save Profile"}
</button>
</div>
</div>
{/* Profile Info */}
<div className="mt-6 flex flex-col items-center px-8">
<input
value={name}
onChange={e => setName(e.target.value)}
className="text-2xl md:text-3xl font-serif font-bold bg-transparent border-none w-full text-center mb-2 text-[#ede9fe] drop-shadow focus:outline-none"
/>
<div className="text-[#6C63A6] mb-2 text-center text-lg font-semibold drop-shadow">{email}</div>
<input
value={phone}
onChange={e => setPhone(e.target.value)}
className="text-[#6C63A6] mb-2 text-center text-base font-medium bg-transparent border-none w-full focus:outline-none"
placeholder="Phone number"
/>
<textarea
value={bio}
onChange={e => setBio(e.target.value)}
className="bg-transparent border-none w-full text-center text-[#6C63A6] mb-4 font-medium focus:outline-none"
rows={2}
/>
</div>
{/* Journal Entries */}
<div className="mt-12">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-[#A09ABC] mb-4 drop-shadow mx-6 my-4">Your Journal Entries</h3>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-[#A09ABC] mb-4 drop-shadow">Your Journal Entries</h3>
<div className="space-y-4">
{journalEntries.length === 0 && (
  <div>
    <div className="text-[#B6A6CA] text-center mx-6 my-4">No journal entries yet.</div>
    <div className="text-[#B6A6CA] text-center">No journal entries yet.</div>
  </div>
)}
{journalEntries.map((entry: JournalEntry) => (
<div key={entry.id} className="bg-white/70 rounded-xl p-4 shadow flex flex-col border border-white/30">
<div className="text-sm text-[#A09ABC] mb-1">
{new Date(entry.created_at).toLocaleString()}
</div>
<div className="font-semibold text-[#6C63A6]">{entry.title}</div>
<div className="text-[#6C63A6]">{entry.content}</div>
</div>
))}
</div>
</div>
</div>
</main>
</div>
);
}
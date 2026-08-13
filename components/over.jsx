"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

export default function CommentSection({ blog_id, OnClick }) {
    const t = useTranslations("comment");
    const [comments, setComments] = useState(null);
    const [isLoading, setLoading] = useState(true);

    function validate(id, message) {
        let value = document.getElementById(id).value;
        if (!value) {
            toast.error(message);
            document.getElementById(id)?.focus();
            return null;
        }
        return value;
    }

    async function EnterComments() {
        let userName = validate("commentorName", t("Please enter your name"));
        if (!userName) return;
        let userEmail = validate("commentorEmail", t("Please enter your email, Your email will never become visible to public"));
        if (!userEmail) return;
        let userComment = validate("comment", t("Please write some text!"));
        if (!userComment) return;

        const posting = toast.loading(t("Posting your comment!"));

        try {
            const response = await fetch("/api/postcomment", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "post",
                body: JSON.stringify({
                    name: userName,
                    email: userEmail,
                    comment: userComment,
                    blogId: blog_id
                })
            });

            if (response.ok) {
                toast.success(t("Your comment successfully posted!"), { id: posting });
                document.getElementById("commentorName").value = "";
                document.getElementById("commentorEmail").value = "";
                document.getElementById("comment").value = "";
                GetComments();
            } else {
                toast.error(t("Your comment couldn't be posted!"), { id: posting });
            }
        } catch (err) {
            toast.error(t("Your comment couldn't be posted!"), { id: posting });
        }
    }

    async function GetComments() {
        try {
            const response = await fetch("/api/showcomments", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    blog_id: blog_id
                })
            });

            const data = await response.json();
            setComments(data?.data?.comments?.result);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    }

    useEffect(() => {
        GetComments();
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn">
            <div className="border border-(--border) overflow-hidden rounded-3xl p-5 sm:p-6 w-full max-w-lg h-[85vh] max-h-[650px] relative flex flex-col justify-between bg-(--background) shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-(--border) z-20">
                    <h3 className="text-xl font-extrabold text-(--foreground) tracking-tight">
                        Comments
                    </h3>
                    <button 
                        onClick={OnClick}
                        className="w-9 h-9 rounded-full bg-(--foreground)/5 hover:bg-(--foreground)/15 flex items-center justify-center transition-all duration-200 cursor-pointer text-(--foreground)"
                        aria-label="Close comments"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Comments List Section */}
                <div className="flex flex-col gap-3 w-full flex-1 overflow-y-auto py-4 pr-1">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loading loadingItem={"comments"} />
                        </div>
                    ) : comments && comments.length > 0 ? (
                        comments.map((cm, index) => (
                            <Comment key={index} comment={cm.comment} name={cm.name} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-(--foreground) opacity-50 text-sm font-medium px-4">
                            No comments yet. Be the first to share your thoughts!
                        </div>
                    )}
                </div>

                {/* Input Form Section */}
                <div className="pt-4 border-t border-(--border) flex flex-col gap-y-3 z-20 bg-(--background)">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            id="commentorName" 
                            autoComplete="name" 
                            className="w-1/2 border border-(--border) bg-(--foreground)/5 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm outline-none focus:border-(--primary) text-(--foreground) transition-all placeholder:text-(--foreground)/40" 
                            placeholder={t("Name")} 
                            title={t("Name")}
                        />
                        <input 
                            type="text" 
                            id="commentorEmail" 
                            autoComplete="email" 
                            className="w-1/2 border border-(--border) bg-(--foreground)/5 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm outline-none focus:border-(--primary) text-(--foreground) transition-all placeholder:text-(--foreground)/40" 
                            placeholder={t("Email")} 
                            title={t("Email")} 
                        />
                    </div>
                    <textarea 
                        id="comment" 
                        placeholder={t("Comment")} 
                        className="w-full h-20 border border-(--border) bg-(--foreground)/5 py-2 px-3.5 rounded-xl text-xs sm:text-sm outline-none focus:border-(--primary) text-(--foreground) transition-all resize-none placeholder:text-(--foreground)/40" 
                        title={t("Comment")}
                    />
                    <button 
                        type="button" 
                        className="w-full py-3 rounded-xl bg-(--primary) text-white text-sm font-bold tracking-wide cursor-pointer shadow-lg hover:opacity-90 transition-all duration-200" 
                        onClick={EnterComments}
                    >
                        {t("Submit")}
                    </button>
                </div>

            </div>
        </div>
    );
}

function Comment({ comment, name }) {
    return (
        <div className="border border-(--border) bg-(--foreground)/5 rounded-2xl p-4 w-full shrink-0 flex flex-col gap-1 transition-all">
            <span className="font-extrabold text-xs text-(--primary) tracking-wide">{name}</span>
            <p className="text-sm text-(--foreground) opacity-90 leading-relaxed break-words">
                {comment}
            </p>
        </div>
    );
}
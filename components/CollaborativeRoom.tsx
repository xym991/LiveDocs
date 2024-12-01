"use client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Loader from "./Loader";
import Header from "./Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Editor } from "./editor/Editor";
import ActiveCollaborators from "./ActiveCollaborators";
import { Input } from "./ui/input";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { updateDocumentTitle } from "@/lib/actions/room.actions";
import ShareModal from "./ShareModal";

const CollaborativeRoom = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
}: CollaborativeRoomProps) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);

  const containerRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const UpdateTitleHandler = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      if (documentTitle !== roomMetadata.title) {
        const updatedDocument = await updateDocumentTitle(
          roomId,
          documentTitle
        );
      }
    } catch (err) {
      console.error("Error updating document title:", err);
    }
    setEditing(false);
    setLoading(false);
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing, setEditing]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        UpdateTitleHandler();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [documentTitle, roomId]);

  return (
    <div className="w-full">
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loader />}>
          <div className="collaborative-room">
            <Header>
              <div
                ref={containerRef}
                className="flex w-fit item-center justify-center gap-2"
              >
                {editing && !loading ? (
                  <Input
                    type="text"
                    value={documentTitle}
                    ref={inputRef}
                    placeholder="Enter Title"
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    onKeyDown={(e) => e.key == "Enter" && UpdateTitleHandler()}
                    className="document-title-input"
                  />
                ) : (
                  <p className="document-title">{documentTitle}</p>
                )}
                {currentUserType == "editor" ? (
                  !editing ? (
                    <Image
                      src="/assets/icons/edit.svg"
                      alt="edit"
                      width={24}
                      height={24}
                      onClick={(_) => setEditing(true)}
                      className="pointer"
                    />
                  ) : (
                    <> </>
                  )
                ) : (
                  <></>
                )}

                {loading && (
                  <p className="text-sm text-gray-400 flex items-center">
                    Saving...
                  </p>
                )}
              </div>

              <div className="flex flx-1 justify-end gap-2 sm:gap-3">
                <ActiveCollaborators />
                <ShareModal
                  roomId={roomId}
                  collaborators={users}
                  creatorId={roomMetadata.creatorId}
                  currentUserType={currentUserType}
                />
                <SignedIn>
                  <UserButton></UserButton>
                </SignedIn>
                <SignedOut>
                  <SignInButton></SignInButton>
                </SignedOut>
              </div>
            </Header>
            <Editor roomId={roomId} currentUserType={currentUserType} />
          </div>
        </ClientSideSuspense>
      </RoomProvider>
    </div>
  );
};

export default CollaborativeRoom;

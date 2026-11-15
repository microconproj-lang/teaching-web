import { getAvatar } from "@/core/avatars";
import { PROFILE_FRAMES } from "@/core/config/shop";

export function AvatarEmblem({
  avatarKey,
  frameKey = "none",
  size = 44,
  className = "",
}: {
  avatarKey: string | null | undefined;
  frameKey?: string | null;
  size?: number;
  className?: string;
}) {
  const avatar = getAvatar(avatarKey);
  const frame = PROFILE_FRAMES.find((f) => f.key === frameKey) ?? PROFILE_FRAMES[0];
  const fontSize = Math.max(16, Math.round(size * 0.5));

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${avatar.gradient} ${frame.ringClass} shadow-sm ${className}`}
      style={{ width: size, height: size, fontSize }}
      role="img"
      aria-label={`อวตาร: ${avatar.label}`}
      title={avatar.label}
    >
      <span className="leading-none select-none">{avatar.emoji}</span>
    </span>
  );
}

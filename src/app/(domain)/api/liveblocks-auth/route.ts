import { Liveblocks } from "@liveblocks/node";
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});
export async function POST(req: Request) {
  const { document, user } = await req.json();

  if (!document) {
    return new Response("未认证document", { status: 404 });
  }

  const isOwner = document.ownerId === user.id;
  const isInOrganization = !!(
    document.organizationId && document.organizationId === user.currentOrgId
  );

  if (!isOwner && !isInOrganization) {
    return new Response("未认证isOwner和isInOrganization", { status: 401 });
  }

  const name = user.username ?? user.email ?? "匿名";
  const nameToNumber = name
    .split("")
    .reduce((acc: any, char: any) => acc + char.charCodeAt(0), 0);
  const color = `hsl(${Math.abs(nameToNumber) % 360}, 80%, 60%)`;

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name,
      avatar: user.avatarUrl,
      color,
    },
  });

  session.allow(document.id, session.FULL_ACCESS);
  const { body, status } = await session.authorize();

  return new Response(body, { status });
}

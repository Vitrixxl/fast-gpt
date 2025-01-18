ALTER TABLE "chats" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "chats" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "chatId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
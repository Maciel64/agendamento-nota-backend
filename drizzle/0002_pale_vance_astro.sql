CREATE TABLE "agenda_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"start_time" text,
	"end_time" text,
	"reason" text,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"service_id" text NOT NULL,
	"customer_id" text,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text NOT NULL,
	"service_name_snapshot" text NOT NULL,
	"service_price_snapshot" text NOT NULL,
	"service_duration_snapshot" text NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"address" text,
	"contact" text,
	"site_customization" jsonb DEFAULT '{"layout_global":{"header":{},"footer":{},"typography":{},"base_colors":{}},"home":{"hero_banner":{},"services_section":{},"contact_section":{}},"gallery":{"grid_config":{},"interactivity":{}},"about_us":{"about_banner":{},"our_story":{},"our_values":[],"our_team":[],"testimonials":[]},"appointment_flow":{"step_1_services":{},"step_2_date":{},"step_3_time":{},"step_4_confirmation":{}}}'::jsonb NOT NULL,
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "google_calendar_configs" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"ical_url" text,
	"sync_status" text DEFAULT 'INACTIVE' NOT NULL,
	"last_synced_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"quantity" text NOT NULL,
	"unit" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "operating_hours" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"day_of_week" text NOT NULL,
	"status" text NOT NULL,
	"morning_start" text,
	"morning_end" text,
	"afternoon_start" text,
	"afternoon_end" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_resources" (
	"id" text PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"inventory_id" text NOT NULL,
	"consumption_unit" text NOT NULL,
	"conversion_factor" text NOT NULL,
	"purchase_unit" text NOT NULL,
	"consumed_quantity" text NOT NULL,
	"output_factor" text NOT NULL,
	"trigger" text DEFAULT 'UPON_COMPLETION' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" text NOT NULL,
	"duration" text NOT NULL,
	"icon" text,
	"is_visible" boolean DEFAULT true NOT NULL,
	"advanced_rules" jsonb DEFAULT '{"conflicts":[]}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointment" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "business" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "report" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "appointment" CASCADE;--> statement-breakpoint
DROP TABLE "business" CASCADE;--> statement-breakpoint
DROP TABLE "report" CASCADE;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "agenda_blocks" ADD CONSTRAINT "agenda_blocks_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_customer_id_user_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "google_calendar_configs" ADD CONSTRAINT "google_calendar_configs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operating_hours" ADD CONSTRAINT "operating_hours_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_resources" ADD CONSTRAINT "service_resources_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_resources" ADD CONSTRAINT "service_resources_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
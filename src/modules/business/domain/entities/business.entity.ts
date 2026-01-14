export type Business = {
  id: string;
  name: string;
  slug: string;
  siteCustomization: any;
  ownerId: string;
  createdAt: Date;
  updatedAt?: Date;
};

export type BusinessSummary = {
  id: string;
  name: string;
  slug: string;
  siteCustomization: any;
  createdAt: Date;
};

export type CreateBusinessInput = {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  siteCustomization: any;
};

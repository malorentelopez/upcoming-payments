export type MerchantCatalogEntry = {
  slug: string;
  name: string;
  iconSlug: string;
  aliases: string[];
};

export type ResolvedMerchant = {
  slug: string;
  name: string;
  color: string;
  path: string;
};

import { ProfileCard as ClientProfileCard } from '@/components/layout/client/settings/ProfileCard';

export function ProviderProfileCard(props: any) {
  // We can just wrap the ClientProfileCard and maybe pass different strings if we could,
  // but since the strings are hardcoded in ProfileCard, let's just make a provider version.
  return <ClientProfileCard {...props} />;
}

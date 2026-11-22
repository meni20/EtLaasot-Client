export function regularDataAccessReady(input: {
  checked: boolean;
  enabled: boolean;
  verified: boolean;
  accessBlocked?: boolean;
}) {
  return (
    !input.checked ||
    !input.enabled ||
    (input.verified && input.accessBlocked === false)
  );
}

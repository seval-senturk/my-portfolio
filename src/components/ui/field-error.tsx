import { Text } from "@/components/ui/text";

interface FieldErrorProps {
  id: string;
  message?: string;
}

export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <Text as="p" id={id} variant="small" className="mt-1 text-error" role="alert">
      {message}
    </Text>
  );
}

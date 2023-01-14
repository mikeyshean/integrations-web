import { classNames } from "../utils";

export function ValidationMessage({isValid, message, id }: { isValid: boolean, message: string, id: string}) {
  return (
      <p className={classNames(
        isValid ? "hidden" : "",
        "mt-2 text-sm text-red-600"
        )} id={id}>
        {message}
      </p>
  )
}


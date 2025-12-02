import { TextField, type TextFieldProps } from "@mui/material";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";

type Props<T extends FieldValues> = { //T extends FieldValues solves the 'control' error in ProductForm
    label: string
    name: keyof T //type safety for name of the input
} & UseControllerProps<T> & TextFieldProps

export default function AppTextInput<T extends FieldValues>(props: Props<T>) {
    const { fieldState, field } = useController({ ...props });
    return (
        <TextField
            {...props}
            {...field}
            multiline={props.multiline}
            rows={props.rows}
            type={props.type}
            fullWidth 
            value={field.value || ''}
            variant="outlined" error={!!fieldState.error} helperText={fieldState.error?.message}
        />
    )
}
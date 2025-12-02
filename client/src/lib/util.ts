import type { FieldValues, Path, UseFormSetError } from "react-hook-form"

export function currencyFormat(amount: number) {
    return '$' + (amount / 100).toFixed(2)
}

export function filterEmptyValues(values: object) {
    return Object.fromEntries(
        Object.entries(values).filter(
            ([, value]) => value !== '' && value !== null && value != undefined && value.length !== 0 //Send only properties that have value in url
        )
    )
}

export function handleApiError<T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>,
    fieldNames: Path<T>[]
) {
    const apiError = (error as {message: string}) || {};

    if (apiError.message && typeof apiError.message === 'string'){
        const errorArray = apiError.message.split(',');

        errorArray.forEach(e => {
            const matchedField = fieldNames.find(fieldName => e.toLowerCase().includes(fieldName.toString().toLowerCase()));

            if (matchedField) setError(matchedField, {message: e.trim()});
        })
    }
}
import { SelectOption } from "@/components/SelectBox";
import { MultiValue } from "react-select";

export function toNumberArray(selectedOptions: MultiValue<SelectOption>): number[] {
    return selectedOptions
        .map(option => Number(option.value)) // value を数値に変換
        .filter(value => !isNaN(value)); // NaN の値を除外
}
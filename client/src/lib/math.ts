import numeral from "numeral";


export function formatWithCommas(val: number): string {
    return numeral(val).format('0,0')
}
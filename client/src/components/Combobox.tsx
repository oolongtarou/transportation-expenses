import CreatableSelect from 'react-select/creatable';

interface ComboboxProps {
    onChange: (value: string) => void;
}

const Combobox = (props: ComboboxProps) => {
    const { onChange } = props;
    return (
        <CreatableSelect
            isClearable
            options={options}
            onChange={(e) => onChange(e?.value ?? "")}
            components={{
                IndicatorSeparator: () => null,
            }}
        />
    )
}

export default Combobox

interface SelectOption {
    id: number
    label: string
    value: string
}

const options: SelectOption[] = [
    { id: 1, value: 'chocolate', label: 'Chocolate' },
    { id: 2, value: 'strawberry', label: 'Strawberry' },
    { id: 3, value: 'vanilla', label: 'Vanilla' }
]

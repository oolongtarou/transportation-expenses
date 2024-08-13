import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';

export interface SelectOption {
    value: string
    label: string
}

interface SelectBoxProps {
    options: SelectOption[];
    onChange: (value: SelectOption) => void;
}


interface MultiSelectBoxProps {
    options: SelectOption[];
    onChange: (value: SelectOption[]) => void;
}

export const SelectBox = (props: SelectBoxProps) => {
    const { options, onChange } = props;
    return (
        <Select
            options={options}
            onChange={(e) => onChange({ label: e?.label ?? '', value: e?.value ?? '' })}
            components={{
                IndicatorSeparator: () => null,
            }}
        />
    )
}

export const CreatableSelectBox = (props: SelectBoxProps) => {
    const { options, onChange } = props;
    return (
        <CreatableSelect
            isClearable
            options={options}
            onChange={(e) => onChange({ label: e?.label ?? '', value: e?.value ?? '' })}
            components={{
                IndicatorSeparator: () => null,
            }}
        />
    )
}

export const MultiSelectBox = (props: MultiSelectBoxProps) => {
    const { options } = props;
    return (
        <Select
            isClearable
            isMulti
            options={options}
            // onChange={(e) => onChange({ label: e?.label ?? '', value: e?.value ?? '' })}
            components={{
                IndicatorSeparator: () => null,
            }}
        />
    )
}
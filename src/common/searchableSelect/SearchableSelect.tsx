"use client";

import Select, {
    type ClassNamesConfig,
    type SingleValue,
} from "react-select";

export type SearchableSelectOption = {
    value: string;
    label: string;
};

type SearchableSelectProps = {
    label: string;
    options: SearchableSelectOption[];
    value: string;
    onChangeAction: (value: string) => void;
    placeholder?: string;
    noOptionsMessage?: string;
    loadingMessage?: string;
    error?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
};

const classNames: ClassNamesConfig<
    SearchableSelectOption,
    false
> = {
    control: ({ isFocused, isDisabled }) =>
        [
            "min-h-11 rounded-xl border bg-zinc-900 shadow-none transition-colors",
            isFocused
                ? "border-blue-500 ring-2 ring-blue-500/15"
                : "border-white/10 hover:border-white/20",
            isDisabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer",
        ].join(" "),

    valueContainer: () => "px-3 py-0",

    singleValue: () => "text-sm text-white",

    placeholder: () => "text-sm text-zinc-500",

    input: () => "m-0 p-0 text-sm text-white",

    indicatorSeparator: () => "hidden",

    indicatorsContainer: () => "pr-1",

    clearIndicator: () =>
        "rounded-md p-2 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white",

    dropdownIndicator: ({ selectProps }) =>
        [
            "rounded-md p-2 text-zinc-500 transition-all",
            "hover:bg-white/10 hover:text-white",
            selectProps.menuIsOpen
                ? "rotate-180"
                : "",
        ].join(" "),

    menu: () =>
        [
            "z-50 mt-2 overflow-hidden rounded-xl",
            "border border-white/10 bg-zinc-950",
            "shadow-2xl shadow-black/40",
        ].join(" "),

    menuList: () => "max-h-64 p-2",

    option: ({
                 isFocused,
                 isSelected,
                 isDisabled,
             }) =>
        [
            "cursor-pointer rounded-lg px-3 py-2.5 text-sm transition-colors",
            isSelected
                ? "bg-blue-500/15 text-blue-300"
                : isFocused
                    ? "bg-white/10 text-white"
                    : "bg-transparent text-zinc-300",
            isDisabled
                ? "cursor-not-allowed opacity-50"
                : "",
        ].join(" "),

    noOptionsMessage: () =>
        "py-6 text-sm text-zinc-500",

    loadingMessage: () =>
        "py-6 text-sm text-zinc-500",

    loadingIndicator: () => "text-blue-400",
};

export const SearchableSelect = ({
                                     label,
                                     options,
                                     value,
                                     onChangeAction,
                                     placeholder = "Оберіть торгову пару",
                                     noOptionsMessage = "Торгову пару не знайдено",
                                     loadingMessage = "Завантаження торгових пар...",
                                     error,
                                     isLoading = false,
                                     isDisabled = false,
                                     isRequired = false,
                                 }: SearchableSelectProps) => {
    const selectedOption =
        options.find(
            (option) => option.value === value,
        ) ?? null;

    const handleChange = (
        option: SingleValue<SearchableSelectOption>,
    ) => {
        onChangeAction(option?.value ?? "");
    };

    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
            {label}

    {isRequired ? (
        <span className="ml-1 text-red-400">
            *
            </span>
    ) : null}
    </label>

    <Select<SearchableSelectOption, false>
    options={options}
    value={selectedOption}
    onChange={handleChange}
    isSearchable
    isClearable
    isLoading={isLoading}
    isDisabled={isDisabled}
    placeholder={placeholder}
    noOptionsMessage={() =>
    noOptionsMessage
}
    loadingMessage={() =>
    loadingMessage
}
    classNames={classNames}
    unstyled
    />

    {error ? (
            <p className="mt-1.5 text-sm text-red-400">
                {error}
                </p>
        ) : null}
    </div>
);
};
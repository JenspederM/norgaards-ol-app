<script lang="ts">
    export let placeholder = "";
    export let label = "";
    export let value;
    export let type = "text";

    const handleInput = (e) => {
        // in here, you can switch on type and implement
        // whatever behaviour you need
        value = type.match(/^(number|range)$/)
            ? +e.target.value
            : e.target.value;
    };

    $: displayValue = value ? value : "";
</script>

<div>
    <label
        class="text-white text-sm font-bold xl:text-2xl 2xl:text-4xl"
        for="{label.toLowerCase()}-id">{label}</label
    >
    <input
        {type}
        value={displayValue}
        {placeholder}
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="{label.toLowerCase()}-id"
        on:input={handleInput}
    />
</div>

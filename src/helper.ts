export default {
    compare: (str1: string, str2: string) => {
        return (str1 || '').trim().toLowerCase() === (str2 || '').trim().toLowerCase();
    },
    parseJson: (content: string) => {
        if (!content) {
            return '';
        }

        // remove trailing commas, JSON.parse fails to parse
        // reference - https://stackoverflow.com/questions/34344328/json-remove-trailiing-comma-from-last-object
        const removeCommaRegex = /\,(?=\s*?[\}\]])/g; // remove all trailing commas
        content = content.replace(removeCommaRegex, '');

        // remove multiline strings, JSON.parse fails to parse
        // reference - https://stackoverflow.com/questions/2392766/multiline-strings-in-json
        const removeMultiStringRegex = /\\\s+/g; // remove multiline strings
        content = content.replace(removeMultiStringRegex, ' '); // removing the multiline strings as suggested by ETL engineers
        return JSON.parse(content);
    }
};

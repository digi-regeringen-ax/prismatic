export const isSecret = (person) => person.protected_identity === TRUE;

function removeProperties(obj, propsToRemove) {
    // Helper function to remove a property based on the path
    const removeNestedProperty = (obj, path) => {
        const keys = path.split('.'); // Split path into keys

        let current = obj;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];

            // If the key is a number, convert it to an integer to handle array indices
            const keyIndex = Number.isNaN(Number(key)) ? key : Number(key);

            if (current[keyIndex] === undefined) {
                return; // Property path does not exist
            }

            current = current[keyIndex]; // Traverse deeper
        }

        // Remove the property at the last key
        const finalKey = keys[keys.length - 1];
        const finalKeyIndex = Number.isNaN(Number(finalKey)) ? finalKey : Number(finalKey);
        delete current[finalKeyIndex];
    };

    // Loop over the array of property paths and remove each one
    propsToRemove.forEach(path => removeNestedProperty(obj, path));

    return obj;
}

export const clearSecretFields = (person) => {
    if (isSecret(person)) {
        return removeProperties(person, [
            'addresses.postal',
            'addresses.temporary',
            'addresses.temporary_abroad',
            'addresses.postal_abroad',
            'addresses.permanent',
            'addresses.permanent_abroad',
            'home_municipality',
            'temporary_municipality',
            'temporary_resident_location',
            'adress_in_permanent_place',
            'municipality_turn_year',
            'email',
            'TILAPAINEN_KOTIMAINEN_ASUINPAIKKATUNNUS',
            'TILAPAINEN_ULKOMAILLA_ASUMINEN',
            'VAKINAINEN_KOTIMAINEN_ASUINPAIKKATUNNUS',
            'VAKINAINEN_ULKOMAILLA_ASUMINEN'
        ]);
    }
    return person;
}

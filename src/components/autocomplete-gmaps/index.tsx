import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useMemo, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';

const DEBOUNCE_TIME = 500;

export interface AutocompleteGmapsProps {
    id?: string;
    label: string;
    onOptionSelected: (suggestion: AutocompleteOption) => void;
}

function isAutocompleteOption(val: string | null | AutocompleteOption): val is AutocompleteOption {
    return !(typeof val === 'string' || !val);
}

const dubaiBounds = {
    north: { lat: 25.345277, lng: 55.302962 },
    west: { lat: 25.146538, lng: 54.950026 },
    south: { lat: 24.946229, lng: 55.353773 },
    east: { lat: 25.157725, lng: 55.519942 },
}

export interface AutocompleteOption {
    label: string;
    value: string | undefined;
};

const AutocompleteGmaps = ({
    id,
    label,
    onOptionSelected,
}: AutocompleteGmapsProps)  => {
    const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
    const [options, setOptions] = useState<AutocompleteOption[]|null>(null);
    const [selectedOption, setSelectedOption] = useState<AutocompleteOption | null>(null);

    useEffect(() => {
        (async () => {
            const { AutocompleteService } = (await window.google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
            const service = new AutocompleteService();
            setAutocompleteService(service);
        })();
    }, []);

    const handleInputChange = useMemo(() => debounce(async (e) => {
        if (!autocompleteService || !e.target.value) {
            return;
        }
        autocompleteService.getPlacePredictions({
            input: e.target.value,
            locationRestriction: {
                north: dubaiBounds.north.lat,
                east: dubaiBounds.east.lng,
                south: dubaiBounds.south.lat,
                west: dubaiBounds.west.lng,
            },
            types: [
              'neighborhood', // ex.: Dubai Marina
              'sublocality', // ex.: Business Bay
            ]
        }, (predictions, status) => {
            if (!predictions || status === 'ZERO_RESULTS') {
              setOptions([]);
            } else {
              setOptions(predictions.map((o) => ({ label: o.description, value: o.place_id ?? undefined })));
            }
        });
    }, DEBOUNCE_TIME), [autocompleteService]);

    const handleOnChange = useCallback((e: any, val: string | null | AutocompleteOption) => {
        if (!isAutocompleteOption(val)) {
            return;
        }
        setSelectedOption(val);
        onOptionSelected(val);
    }, [onOptionSelected])


    return (
        <Autocomplete
          autoComplete={false}
          disablePortal
          freeSolo
          id={id}
          options={options ?? []}
          sx={{ width: '100%' }}
          onInput={handleInputChange}
          onChange={handleOnChange}
          noOptionsText="No results found"
          loading={options === null}
          renderInput={(params) => (
            <TextField
                {...params}
                label={label}
            />
          )}
          value={selectedOption?.label ?? null}
        />
    );
};

export default AutocompleteGmaps;
import { useAppDispatch } from "../../state/hooks";
import { searchListingsByPlaceId } from "../../state/listings/slice";
import { trackEvent } from "../../utils/analytics";
import AutocompleteGmaps from "../autocomplete-gmaps";

const SearchBar = () => {
  const dispatch = useAppDispatch();
  return (
    <AutocompleteGmaps
      label="Search share accommodation"
      onOptionSelected={(suggestion) => {
        if (suggestion.value) {
          trackEvent('search', { search_term: `${suggestion.label}_${suggestion.value}` });
          dispatch(searchListingsByPlaceId({
            placeId: suggestion.value,
            placeName: suggestion.label,
          }));
        }
      }}
    />
  );
}

export default SearchBar;
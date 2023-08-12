import { useAppDispatch } from "../../state/hooks";
import { searchListingsByPlaceId } from "../../state/listings/slice";
import AutocompleteGmaps from "../autocomplete-gmaps";

const SearchBar = () => {
  const dispatch = useAppDispatch();
  return (
    <AutocompleteGmaps
      label="Search share accommodation"
      onOptionSelected={(suggestion) => {
        if (suggestion.value) {
          dispatch(searchListingsByPlaceId(suggestion.value));
        }
      }}
    />
  );
}

export default SearchBar;
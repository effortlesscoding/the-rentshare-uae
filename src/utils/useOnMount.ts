import { useEffect, useRef } from "react"

export const useOnMount = (fn: Function) => {
    const mounted = useRef<boolean>(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            fn();
        }
    }, [fn]);
}
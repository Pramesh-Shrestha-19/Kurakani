import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    // ─── Auth State ─────────────────────────────────

    const [user, setUser] = useState(null);

    // ─── Effects ────────────────────────────────────

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {

            setUser(JSON.parse(storedUser));

        }

    }, []);

    // ─── Actions ────────────────────────────────────

    const login = (userData, token) => {

        localStorage.setItem("token", token);

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);

    };

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

    };

    // ─── Context Value ──────────────────────────────

    const value = {

        user,

        login,

        logout

    };

    return (

        <AuthContext.Provider value={value}>

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}
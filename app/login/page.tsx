"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Spacer } from "@nextui-org/react";
import { EyeSlashFilledIcon } from "../../components/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../../components/EyeFilledIcon";



export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            router.push("/");
        } else {
            const result = await response.json();
            if (response.status === 429) {
                setError("Too many failed attempts. Try again later.");
            } else {
                setError(result.message || "Invalid username or password");
            }
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", marginTop: "150px" }}>
            <h1 style={{margin:6}} className="font-bold">Login</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    label="Username"
                    variant="bordered"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Spacer y={1.5} />

                <Input
                    label="Password"
                    fullWidth
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    variant="bordered"
                    // placeholder="Enter your password"
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                            {isVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                    type={isVisible ? "text" : "password"}
                    // className="max-w-xs"
                />
                <Spacer y={1.5} />
                {error && <h1 color="error">{error}</h1>}
                <Spacer y={1} />
                <Button type="submit" fullWidth>
                    Login
                </Button>
            </form>
        </div>
    );
}

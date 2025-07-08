import { logout } from "@/lib/auth";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    return (
        <form action={logout}>
            <Button variant="ghost" size="icon" type="submit" aria-label="Log out">
                <LogOut className="h-5 w-5" />
            </Button>
        </form>
    )
}

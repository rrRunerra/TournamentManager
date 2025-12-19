import { useState, useEffect } from "react";
import { useLsi } from "uu5g05";
import importLsi from "../lsi/import-lsi";
import { useNotification } from "./NotificationProvider";
import { useConfirm } from "./ConfirmProvider";
import { Button } from "./atom/Button";
import Calls from "../calls";
import "../styles/bricks/official-shop.css";

const OFFICIAL_SHOP_ITEMS = [
    {
        id: "os3",
        name: "Pixel Ninja",
        price: 1500,
        image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1Mnh6eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/iXI36c6v8B0pG/giphy.gif"
    },
    {
        id: "os1",
        name: "Gamer Cat",
        price: 2000,
        image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1Mnh6eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/10vXU6Z9GpK6I8/giphy.gif"
    },
    {
        id: "os4",
        name: "Cool Bear",
        price: 3000,
        image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1Mnh6eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l0ExghDSR7YjR4fTO/giphy.gif"
    },
    {
        id: "os2",
        name: "Neon Robot",
        price: 4000,
        image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1Mnh6eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpGZf9U3xW76/giphy.gif"
    },
    {
        id: "os6",
        name: "Space Dog",
        price: 5000,
        image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1Mnh6eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/xT9IgzoKnwUtNpavS0/giphy.gif"
    },
    {
        id: "os5",
        name: "Golden Lion",
        price: 10000,
        image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1Mnh6eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKSjRrfIPjeiZfG/giphy.gif"
    }
];

export default function OfficialShopPopup({ isOpen, onClose, user }) {
    const lsi = useLsi(importLsi, ["OfficialShop"]);
    const { showSuccess, showError } = useNotification();
    const { confirm } = useConfirm();
    const [credits, setCredits] = useState(0);
    const [ownedProfilePics, setOwnedProfilePics] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            fetchPlayerData();
        }
    }, [isOpen, user]);

    const fetchPlayerData = async () => {
        try {
            const player = await Calls.player.get({ id: user.id });
            setCredits(player.credits || 0);
            setOwnedProfilePics(player.ownedProfilePics || []);
        } catch (e) {
            console.error("Failed to fetch player data", e);
        }
    };

    const handlePurchase = async (item) => {
        if (credits < item.price) {
            showError(lsi.insufficientCredits);
            return;
        }

        const isOwned = ownedProfilePics.includes(item.image);
        if (isOwned) {
            showError(lsi.alreadyOwned);
            return;
        }

        const confirmed = await confirm({
            title: lsi.confirmPurchase,
            message: `${lsi.confirmPurchaseMessage} "${item.name}"?`,
            confirmText: lsi.buy,
            cancelText: lsi.cancel,
        });

        if (!confirmed) return;

        setLoading(true);
        try {
            const result = await Calls.player.buyProfilePic({
                id: user.id,
                profilePicUrl: item.image,
                price: item.price
            });
            setCredits(result.credits);
            setOwnedProfilePics(result.ownedProfilePics);
            showSuccess(lsi.purchaseSuccess);
            // Notify other components (like Navbar/Profile) that avatar list or credits might have changed
            window.dispatchEvent(new Event("avatarUpdated"));
        } catch (e) {
            console.error("Purchase failed", e);
            showError(lsi.purchaseError);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="official-shop-overlay" onClick={onClose}>
            <div className="official-shop-content" onClick={(e) => e.stopPropagation()}>
                <div className="official-shop-header">
                    <div className="official-shop-title-area">
                        <h2>{lsi.title}</h2>
                        <div className="official-shop-credits">
                            <span>{lsi.yourCredits}:</span>
                            <span className="official-shop-credits-value">${credits}</span>
                        </div>
                    </div>
                    <Button className="official-shop-close" type="secondary" onClick={onClose}>✕</Button>
                </div>

                <div className="official-shop-grid">
                    {OFFICIAL_SHOP_ITEMS.map((item) => {
                        const isOwned = ownedProfilePics.includes(item.image);
                        return (
                            <div key={item.id} className={`official-shop-item ${isOwned ? "owned" : ""}`}>
                                <div className="official-shop-item-image-wrapper">
                                    <img src={item.image} alt={item.name} className="official-shop-item-image" />
                                </div>
                                <div className="official-shop-item-info">
                                    <div className="official-shop-item-name">{item.name}</div>
                                    <div className="official-shop-item-price">{item.price}</div>
                                </div>
                                <Button
                                    className="official-shop-item-button"
                                    type={isOwned ? "secondary" : credits >= item.price ? "primary-fill" : "secondary"}
                                    onClick={() => handlePurchase(item)}
                                    disabled={isOwned || credits < item.price || loading}
                                >
                                    {isOwned ? lsi.owned : lsi.buy}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

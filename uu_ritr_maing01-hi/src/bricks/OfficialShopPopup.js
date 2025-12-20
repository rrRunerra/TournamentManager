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
    id: 3,
    name: "Boxer",
    price: 2000,
    image:
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXE0cng1eno5OGFyaDdoeG5kZHQxZHJ1MmZwdXVlZm96Y3JocHcyOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wMnZ4nIh1VgcM/giphy.gif",
  },
  {
    id: 1,
    name: "Kobe Bryant",
    price: 5000,
    image:
      "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnM0NHdta2tqeXQ0Zjd4YnV6OGRxemc4ZGl1dDVwY3Nzd2V4cWVtdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iVOfL6bfanQw80zqmb/giphy.gif",
  },
  {
    id: 5,
    name: "NFL Legend",
    price: 10000,
    image:
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjBnajQwYnpwaTNnYWhwYmxwdjNmbDVvZzdoZno3ejFqd3c0d2U4aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wYTpPax479uUTaOzeJ/giphy.gif",
  },
  {
    id: 2,
    name: "Gonzo",
    price: 20000,
    image:
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTI3NmdmNjBnemdqbDI2N3Q1bHRucmlrcHpvbGk1MTg1a2FzZXF5eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GvdifEjs1kfyNuZ6tv/giphy.gif",
  },
  {
    id: 7,
    name: "Soccer Legend",
    price: 75000,
    image:
      "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3QwZnpuMGx1emlyOXc1OXkxdTRxbWhqeXRiczFxZmdjN3F6Nm5zciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QmEV0BAC1xk0ZL4iAx/giphy.gif",
  },
  {
    id: 4,
    name: "Ovi Ovi",
    price: 150000,
    image:
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDlzcXBkeDNiZ2w2YjZydTFzOHM3OTNyaDltdHo0YjdjcnI3a2kxbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JFVx03XKGqtcvf7iRZ/giphy.gif",
  },
  {
    id: 6,
    name: "NBA Greedy",
    price: 250000,
    image:
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaThpNW56cWJhbmdmZjRrZjlycjU0N2luNGVjYTJwdmxqMHduMXlibCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PO4exUD3Ywa64Ej7tg/giphy.gif",
  },
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
        price: item.price,
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
          <Button className="official-shop-close" type="secondary" onClick={onClose}>
            ✕
          </Button>
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

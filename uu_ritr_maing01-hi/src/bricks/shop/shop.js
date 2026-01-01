import { useState, useEffect } from "react";
import { useLsi } from "uu5g05";
import importLsi from "../../lsi/import-lsi";
import { useNotification } from "../../hooks/useNotification.js";
import { useConfirm } from "../components/confirm/ConfirmProvider";
import { Button } from "../components/ui/Button";
import Grid from "../components/ui/Grid";
import Calls from "../../calls";
import "../../styles/bricks/shop.css";

/**
 * Reusable Shop component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the shop is open
 * @param {function} props.onClose - Function to close the shop
 * @param {Object} props.user - The current user object
 * @param {Array} props.items - Array of shop items
 * @param {string} props.title - The title of the shop
 * @param {function} props.onPurchase - Optional callback after successful purchase
 */
export default function Shop({ isOpen, onClose, user, items, title, onPurchase }) {
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
      showError(lsi.insufficientCredits || "Insufficient Credits");
      return;
    }

    const isOwned = ownedProfilePics.includes(item.image);
    if (isOwned) {
      showError(lsi.alreadyOwned || "Already Owned");
      return;
    }

    const confirmed = await confirm({
      title: lsi.confirmPurchase || "Confirm Purchase",
      message: `${lsi.confirmPurchaseMessage || "Are you sure you want to buy"} "${item.name}"?`,
      confirmText: lsi.buy || "Buy",
      cancelText: lsi.cancel || "Cancel",
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
      showSuccess(lsi.purchaseSuccess || "Purchase Successful!");

      // Notify other components (like Navbar/Profile) that avatar list or credits might have changed
      window.dispatchEvent(new Event("avatarUpdated"));

      if (onPurchase) {
        onPurchase(result.credits, result.ownedProfilePics);
      }
    } catch (e) {
      console.error("Purchase failed", e);
      showError(lsi.purchaseError || "Purchase Failed");
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
            <h2>{title || lsi.title}</h2>
            <div className="official-shop-credits">
              <span>{lsi.yourCredits || "Your Credits"}:</span>
              <span className="official-shop-credits-value">${credits}</span>
            </div>
          </div>
          <Button className="official-shop-close" type="secondary" onClick={onClose}>
            ✕
          </Button>
        </div>

        <Grid type="4x4" className="official-shop-grid">
          {items.map((item) => {
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
                  {isOwned ? lsi.owned || "Owned" : lsi.buy || "Buy"}
                </Button>
              </div>
            );
          })}
        </Grid>
      </div>
    </div>
  );
}

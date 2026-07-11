import logo from "../../assets/BetaCare-logo.png";

export function BetaCareLogo({ className = "w-8 h-8" }) {
  return (
    <img src={logo} alt="BetaCare" className={`${className} object-contain`} />
  );
}

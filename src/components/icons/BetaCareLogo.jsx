import logo from "../../assets/BetaCare-logo.png";

export function BetaCareLogo(size = "size-8") {
  return (
    <div className={size}>
      <img src={logo} alt="logo" className="size-full object-cover"/>
    </div>
  );
}

import logo from "@/assets/logo.png";

export function AppLogo({ size = 28 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg bg-primary/10"
      style={{ width: size + 8, height: size + 8 }}
    >
      <img src={logo} alt="Snow Flow" width={size} height={size} className="block" />
    </div>
  );
}

export function AppWordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <AppLogo size={22} />
      <span className="text-base font-semibold tracking-tight text-foreground">Snow Flow</span>
    </div>
  );
}

{
  description = "Logto demo - React sample development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            pnpm
            git
          ];

          shellHook = ''
            echo "Logto demo environment loaded"
            echo "Node.js version: $(node --version)"
            echo "pnpm version: $(pnpm --version)"
            
            # Set up pnpm
            export PNPM_HOME="''${XDG_DATA_HOME:-$HOME/.local/share}/pnpm"
            export PATH="$PNPM_HOME:$PATH"
          '';
        };
      }
    );
}

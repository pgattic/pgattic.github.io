{
  description = "Personal Site Development Flake";

  inputs = {
    nixpkgs.url = "https://channels.nixos.org/nixos-unstable/nixexprs.tar.zst";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs: inputs.flake-parts.lib.mkFlake { inherit inputs; } {
    systems = [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" ];
    perSystem = { pkgs, ... }: {
      devShells.default = pkgs.mkShell {
        buildInputs = [
          pkgs.zola
        ];
      };
    };
  };
}

#!/usr/bin/env bash
# Package the committed code for upload to the Utho server (no GitHub access needed on the server).
#   bash deploy/make-bundle.sh            → researchcops-site-<commit>.tar.gz in the repo folder
# Upload:  scp researchcops-site-*.tar.gz <user>@<utho-ip>:/tmp/
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
[ -z "$(git status --porcelain)" ] || { echo "Commit or stash your changes first: the bundle contains committed files only."; exit 1; }
out="researchcops-site-$(git rev-parse --short HEAD).tar.gz"
git archive --format=tar.gz -o "$out" HEAD
echo "Created $out ($(du -h "$out" | cut -f1))"

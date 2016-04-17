FROM maxcnunes/electron-distribution:eb3node4-onbuild

# Keep the tmp folder inside the project.
# This way we dont lose some cache files between distribution tasks
ENV TMPDIR /usr/src/app/.tmp

# Build all and pack only for Windows
# because is not possible packing for OSX from Linux.
# Use unsafe-perm to force npm respect the tmp path (http://git.io/vB2oR)
CMD ["npm", "run", "--unsafe-perm", "dist:winlinux"]

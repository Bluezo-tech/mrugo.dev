import struct
import os

TMP = os.path.join(os.environ["LOCALAPPDATA"], "Temp")
SIZES = [16, 32, 48, 64]

# ICO stores PNG payloads directly (supported since Windows Vista), which keeps
# the icon crisp at every size instead of one scaled bitmap.
payloads = []
for size in SIZES:
    path = os.path.join(TMP, "icon-%d.png" % size)
    with open(path, "rb") as handle:
        payloads.append(handle.read())

header = struct.pack("<HHH", 0, 1, len(SIZES))
offset = 6 + 16 * len(SIZES)
entries = b""
for size, png in zip(SIZES, payloads):
    entries += struct.pack(
        "<BBBBHHII", size % 256, size % 256, 0, 0, 1, 32, len(png), offset
    )
    offset += len(png)

out = os.path.join("public", "favicon.ico")
with open(out, "wb") as handle:
    handle.write(header + entries + b"".join(payloads))

print("wrote", out, os.path.getsize(out), "bytes")

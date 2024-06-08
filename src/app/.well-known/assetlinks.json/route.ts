import { NextResponse } from "next/server";

export const GET = () =>
  NextResponse.json([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.gpa.flutter.app",
        sha256_cert_fingerprints: [
          "7B:C9:14:DA:5C:C5:37:31:C2:97:29:49:A9:94:7C:32:26:E2:E8:56:C5:03:D9:DD:81:EB:2C:14:45:45:A7:5F",
        ],
      },
    },
  ]);

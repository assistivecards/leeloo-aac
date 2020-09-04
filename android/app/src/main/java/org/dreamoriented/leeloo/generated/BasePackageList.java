package org.dreamoriented.leeloo.generated;

import java.util.Arrays;
import java.util.List;
import org.unimodules.core.interfaces.Package;

public class BasePackageList {
  public List<Package> getPackageList() {
    return Arrays.<Package>asList(
        new expo.modules.constants.ConstantsPackage(),
        new expo.modules.application.ApplicationPackage(),
        new expo.modules.av.AVPackage(),
        new expo.modules.device.DevicePackage(),
        new expo.modules.errorrecovery.ErrorRecoveryPackage(),
        new expo.modules.filesystem.FileSystemPackage(),
        new expo.modules.font.FontLoaderPackage(),
        new expo.modules.google.signin.GoogleSignInPackage(),
        new expo.modules.haptics.HapticsPackage(),
        new expo.modules.imageloader.ImageLoaderPackage(),
        new expo.modules.inapppurchases.InAppPurchasesPackage(),
        new expo.modules.keepawake.KeepAwakePackage(),
        new expo.modules.lineargradient.LinearGradientPackage(),
        new expo.modules.localization.LocalizationPackage(),
        new expo.modules.location.LocationPackage(),
        new expo.modules.notifications.NotificationsPackage(),
        new expo.modules.permissions.PermissionsPackage(),
        new expo.modules.screenorientation.ScreenOrientationPackage(),
        new expo.modules.sharing.SharingPackage(),
        new expo.modules.speech.SpeechPackage(),
        new expo.modules.splashscreen.SplashScreenPackage(),
        new expo.modules.sqlite.SQLitePackage(),
        new expo.modules.updates.UpdatesPackage()
    );
  }
}

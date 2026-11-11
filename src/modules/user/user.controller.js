import { Router } from "express";
import { successResponse } from './../../../common/utils/response/success.response.js';
import { logout, porofileCoverImage, profile, rotateToken, shareProphile, updatePassword } from "./user.service.js";
import { authentication, authorization } from "../../../middleware/authentication.middleware.js";
import { logoutEnum, TokenTypeEnum } from "../../../common/enums/user/security.enms.js";
import { RoleEnum } from "../../../common/enums/user/user.enum.js";
import * as validators from "./user.validation.js"
import { validation } from './../../../middleware/validation.middleware.js';
import { localFieldUpload } from './../../../common/utils/multer/local.multer.js';
import { messageRouter } from "../message/index.js";
const router = Router({caseSensitive:true , strict:true , })

router.post("/logout", authentication(), async (req, res, next) => {
    const status = await logout(req.body, req.user, req.decoded)
    return successResponse({ res , status })
})
 
router.patch("/profile-image",
    authentication(),
    localFieldUpload({ customPath: "user/profile" }).single("attachment"),
    validation(validators.profileImageValidation),
    async (req, res, next) => {
        // const account = await porofileImage(req.file, req.user)
        return successResponse({ res, data: { file: req.file } })
    })

router.patch("/profile-cover-image",
    authentication(),
    localFieldUpload({
        customPath: "user/profile/cover",
    }).array("attachments"),
    validation(validators.profileCoverImageValidation),
    async (req, res, next) => {
        const account = await porofileCoverImage(req.files, req.user)
        return successResponse({ res, data: account })
    })

router.get("/:userID/shared-profile",
    validation(validators.shareProfileValidation),
    async (req, res, next) => {
        const account = await shareProphile(req.params.userID);
        return successResponse({ res, data: account })
    })
 
router.get("/", authentication(TokenTypeEnum.Access), authorization([RoleEnum.user]), async (req, res, next) => {
    const account = await profile(req.user);
    return successResponse({ res, data: account })
});

router.post("/rotate", authentication(TokenTypeEnum.Refresh), async (req, res, next) => {
    const credentials = await rotateToken(req.user, req.decoded ,`${req.protocol}://${req.host}`);
    return successResponse({ res, status:201 , data: {...credentials} });
});

router.patch("/password",
     authentication(),
     validation(validators.updatePassword),
      async (req, res, next) => {
    const credentials = await updatePassword(req.body, req.user ,`${req.protocol}://${req.host}`);
    console.log(req.user);
    
    return successResponse({ res, status:201 , data: {...credentials} });
});

export default router
const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
    {
        bank: {
            accountName: { type: String, required: true },
            accountNumber: { type: String, required: true },
            bankName: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now },
            approvedAt: { type: Date },
        },
        bankHistory: [
            {
                accountName: { type: String },
                accountNumber: { type: String },
                bankName: { type: String },
                uploadedAt: { type: Date },
                approvedAt: { type: Date },
            },
        ],
        document: {
            s3Key: { type: String, default: "" },
            uploadedAt: { type: Date, default: Date.now },
            approvedAt: { type: Date },
        },
        documentHistory: [
            {
                s3Key: { type: String },
                uploadedAt: { type: Date },
                approvedAt: { type: Date },
            },
        ],
        clients: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        confirmed: {
            type: Boolean,
            default: false,
        },
        contacts: {
            store: {
                name: { type: String },
                email: { type: String },
                mobile: { type: String },
                phone: { type: String },
            },
            customerService: {
                name: { type: String },
                contactNumber: { type: String },
                sameAsStoreManager: { type: Boolean, default: false },
            },
            finance: {
                name: { type: String },
                email: { type: String },
                mobile: { type: String },
            },
        },
        deliveryAddress: {
            address1: { type: String },
            address2: { type: String },
            city: { type: String },
            zipCode: { type: String },
        },
        pending: {
            document: {
                s3Key: { type: String, default: "" },
                uploadedAt: { type: Date, default: Date.now },
                approvedAt: { type: Date },
            },
            bank: {
                accountName: { type: String, default: "" },
                accountNumber: { type: String, default: "" },
                bankName: { type: String, default: "" },
                uploadedAt: { type: Date, default: Date.now },
                approvedAt: { type: Date },
            },
        },
        submitted: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

vendorSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

vendorSchema.set("toJSON", {
    virtuals: true,
});

vendorSchema.virtual("isPendingBank").get(function () {
    return Boolean(
        this.pending.bank &&
            this.pending.bank.accountName &&
            this.pending.bank.accountNumber &&
            this.pending.bank.bankName
    );
});

vendorSchema.virtual("isPending").get(function () {
    return Boolean(
        (this.pending.bank &&
            this.pending.bank.accountName &&
            this.pending.bank.accountNumber &&
            this.pending.bank.bankName) ||
        (this.pending?.document?.s3Key)
    );
});

vendorSchema.set('toJSON', { virtuals: true });
vendorSchema.set('toObject', { virtuals: true });

// we delete the Vendor model. The vendorSchema is exported instead.
// exports.Vendor = mongoose.model("Vendor", vendorSchema);

exports.vendorSchema = vendorSchema

export const handleInvoiceStatusChange = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Si no hay cambio de estado, sigue normal
    if (!status) return next();

    // Si el estado pasa a "enviado" y no hay número de factura, lo genera
    if (status === "enviado") {
      req.generateInvoiceNumber = true;
    }

    next();

  } catch (error) {
    console.error("Error en middleware de invoice:", error);
    res.status(500).json({ message: "Internal middleware error" });
  }
};



export default  { 
    handleInvoiceStatusChange 
};
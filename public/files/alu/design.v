// ============================================================
// 8-bit Arithmetic Logic Unit (ALU)
// Supports: ADD, SUB, AND, OR, XOR, NOR, SLT, SHIFT
// ============================================================

module alu(
    input [7:0] A, B,
    input [2:0] ALU_Sel,
    output reg [7:0] ALU_Out,
    output reg CarryOut
);

always @(*) begin
    case(ALU_Sel)
        3'b000: {CarryOut, ALU_Out} = A + B;              // Addition
        3'b001: {CarryOut, ALU_Out} = A - B;              // Subtraction
        3'b010: {CarryOut, ALU_Out} = {1'b0, A & B};      // AND
        3'b011: {CarryOut, ALU_Out} = {1'b0, A | B};      // OR
        3'b100: {CarryOut, ALU_Out} = {1'b0, A ^ B};      // XOR
        3'b101: {CarryOut, ALU_Out} = {1'b0, ~(A | B)};   // NOR
        3'b110: {CarryOut, ALU_Out} = {1'b0, (A < B) ? 8'd1 : 8'd0}; // SLT
        3'b111: {CarryOut, ALU_Out} = {1'b0, A << 1};     // Left Shift
        default: {CarryOut, ALU_Out} = 9'b0;
    endcase
end

endmodule
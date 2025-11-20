// ============================================================
// Testbench for 8-bit ALU
// Tests all operations with random and fixed inputs
// ============================================================

`timescale 1ns/1ps
module alu_tb;

reg [7:0] A, B;
reg [2:0] ALU_Sel;
wire [7:0] ALU_Out;
wire CarryOut;

integer i;

alu uut (
    .A(A),
    .B(B),
    .ALU_Sel(ALU_Sel),
    .ALU_Out(ALU_Out),
    .CarryOut(CarryOut)
);

initial begin
    $dumpfile("dump.vcd");
    $dumpvars();

    $display("Starting ALU testbench...");
    $display("---------------------------------------------------------");
    $display("| Sel | Operation |     A    |     B    |  Out  | Carry |");
    $display("---------------------------------------------------------");

    // Randomized tests
    for (i = 0; i < 8; i = i + 1) begin
        A = $random;
        B = $random;
        ALU_Sel = i[2:0];
        #10;
        case(ALU_Sel)
            3'b000: $display("| %b  | ADD  | %h | %h | %h | %b |", ALU_Sel, A, B, ALU_Out, CarryOut);
            3'b001: $display("| %b  | SUB  | %h | %h | %h | %b |", ALU_Sel, A, B, ALU_Out, CarryOut);
            3'b010: $display("| %b  | AND  | %h | %h | %h | %b |", ALU_Sel, A, B, ALU_Out, CarryOut);
            3'b011: $display("| %b  | OR   | %h | %h | %h | %b |", ALU_Sel, A, B, ALU_Out, CarryOut);
            3'b100: $display("| %b  | XOR  | %h | %h | %h | %b |", ALU_Sel, A, B, ALU_Out, CarryOut);
            3'b101: $display("| %b  | NOR  | %h | %h | %h | %b |", ALU_Sel, A, B, ALU_Out, CarryOut);
            3'b110: $display("| %b  | SLT  | %h | %h | %h | %b |", ALU_Sel, A, B, ALU_Out, CarryOut);
            3'b111: $display("| %b  | SHL  | %h | %h | %h | %b |", ALU_Sel, A, B, ALU_Out, CarryOut);
        endcase
    end

    $display("---------------------------------------------------------");
    $display("ALU testing complete.");
    $finish;
end

endmodule